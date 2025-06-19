export function checkFormDeploymentStatus(formData: any) {
  const state = formData;
  const hasEverHadDeployment = state.has_deployment;
  const hasActiveDeploymentLink = state.deployment__active && state.deployed_versions.count > 0;

  let deployedVersion = null;
  if (hasActiveDeploymentLink && state.deployed_version_id) {
    deployedVersion = state.deployed_versions.results.find(
      (s: any) => s.uid === state.deployed_version_id
    );
  }
  const isCurrentVersionContentDeployed =
    hasActiveDeploymentLink &&
    deployedVersion &&
    deployedVersion.content_hash === state.version__content_hash;

  const needsFirstTimeDeployment = !hasEverHadDeployment;

  const hasUndeployedChanges = hasEverHadDeployment && !isCurrentVersionContentDeployed;

  const isDeployedWithNoUndeployedChanges = hasEverHadDeployment && isCurrentVersionContentDeployed;

  const isArchived = state.deployment_status === "archived" && state.deployment__active === false;

  return {
    needsFirstTimeDeployment: needsFirstTimeDeployment && !isArchived,
    hasUndeployedChanges: hasUndeployedChanges,
    isDeployedWithNoUndeployedChanges: isDeployedWithNoUndeployedChanges && !isArchived,
    isArchived: isArchived,
  };
}
